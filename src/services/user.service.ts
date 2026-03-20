import bcrypt from "bcrypt";
import { User } from "@/models";
import { IUser, TokenPair } from "@/types";
import { USER_ROLES } from "@/constants";
import { UserValidationUtils } from "@/utils/userValidation";
import { JWTUtils } from "@/utils/jwtUtils";

export class UserService {
  /**
   * Get all active users with wallet balance
   */
  static async getAllUsers(): Promise<IUser[]> {
    return await User.findAll({
      where: { isActive: true },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: number): Promise<IUser | null> {
    return await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({
      where: { email },
    });
  }

  /**
   * Get user by username
   */
  static async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({
      where: { username },
    });
  }

  /**
   * Check if email exists
   */
  static async isEmailExists(email: string): Promise<boolean> {
    const user = await User.findOne({
      where: { email },
      attributes: ["id"],
    });
    return !!user;
  }

  /**
   * Check if username exists
   */
  static async isUsernameExists(username: string): Promise<boolean> {
    const user = await User.findOne({
      where: { username },
      attributes: ["id"],
    });
    return !!user;
  }

  /**
   * Check if user exists (optimized version using utility)
   */
  static async checkUserExists(
    email: string
  ): Promise<{ exists: boolean; existingUser?: Partial<IUser> }> {
    return await UserValidationUtils.checkUserExists(email);
  }

  /**
   * Register new user
   */
  static async registerUser(userData: {
    username: string;
    email: string;
    password: string;
    image?: string;
  }): Promise<{ user: IUser }> {
    // Check if user already exists using optimized utility
    const existenceCheck = await this.checkUserExists(userData.email);
    if (existenceCheck.exists) {
      throw new Error("User with this email already exists");
    }

    // Hash password using utility
    const hashedPassword = await UserValidationUtils.hashPassword(
      userData.password
    );

    // Create user
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      isActive: false,
      role: USER_ROLES.ROLE_USER,
    });

    return {
      user: user.toJSON() as IUser,
    };
  }

  /**
   * Authenticate user login
   */
  static async authenticateUser(
    email: string,
    password: string
  ): Promise<{ user: IUser; tokens: TokenPair }> {
    // Find user by email with password included for verification
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("Sai tài khoản hoặc mật khẩu");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error(
        "Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực."
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Sai tài khoản hoặc mật khẩu");
    }

    // Generate tokens
    const tokens = JWTUtils.generateTokenPair(user);

    // Return user data without password and tokens
    const { password: _password, ...userDataWithoutPassword } = user.toJSON() as IUser;
    void _password;
    const userData = userDataWithoutPassword as IUser;

    return {
      user: userData,
      tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(
    refreshToken: string
  ): Promise<{ user: IUser; tokens: TokenPair }> {
    try {
      // Verify refresh token
      const decoded = JWTUtils.verifyRefreshToken(refreshToken);

      // Find user by ID
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Check if user is still active
      if (!user.isActive) {
        throw new Error("Account is deactivated");
      }

      // Generate new token pair
      const tokens = JWTUtils.generateTokenPair(user);

      return {
        user: user.toJSON() as IUser,
        tokens,
      };
    } catch {
      throw new Error("Invalid refresh token");
    }
  }

  /**
   * Get user profile from token
   */
  static async getUserFromToken(token: string): Promise<IUser> {
    try {
      const decoded = JWTUtils.verifyAccessToken(token);

      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.isActive) {
        throw new Error("Account is deactivated");
      }

      return user.toJSON() as IUser;
    } catch {
      throw new Error("Invalid token");
    }
  }

  /**
   * Get user profile by user ID
   */
  static async getUserProfile(userId: number): Promise<IUser | null> {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    return user.toJSON() as IUser;
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: number,
    updateData: {
      username?: string;
      email?: string;
    }
  ): Promise<IUser | null> {
    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }

    // Check if new email already exists (if email is being updated)
    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await this.isEmailExists(updateData.email);
      if (emailExists) {
        throw new Error("Email already exists");
      }
    }

    // Check if new username already exists (if username is being updated)
    if (updateData.username && updateData.username !== user.username) {
      const usernameExists = await this.isUsernameExists(updateData.username);
      if (usernameExists) {
        throw new Error("Username already exists");
      }
    }

    await user.update(updateData);
    return user.toJSON() as IUser;
  }

  /**
   * Change password
   */
  static async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await User.findByPk(userId);
    if (!user) {
      return false;
    }

    if (!user.isActive) {
      throw new Error("Tài khoản đã bị vô hiệu hóa");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Mật khẩu hiện tại không chính xác");
    }

    // Hash new password using utility
    const hashedNewPassword = await UserValidationUtils.hashPassword(
      newPassword
    );

    // Update password
    await user.update({ password: hashedNewPassword });
    return true;
  }
}
