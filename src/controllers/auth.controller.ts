import { Request, Response } from "express";
import { UserService } from "@/services/user.service";
import {
  sendSuccessResponse,
  sendErrorResponse,
  sendValidationErrorResponse,
} from "@/utils/responseFormatter";
import { MESSAGES, HTTP_STATUS } from "@/constants";
import { asyncHandler } from "@/middlewares/error";
import { CookieUtils } from "@/utils/cookieUtils";

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { username, email, password, image } = req.body;

    try {
      const result = await UserService.registerUser({
        username,
        email,
        password,
        image,
      });

      sendSuccessResponse(
        res,
        {
          user: result.user,
          message: MESSAGES.SUCCESS.AUTH.REGISTER_SUCCESS,
        },
        MESSAGES.SUCCESS.AUTH.REGISTER_SUCCESS,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          sendValidationErrorResponse(res, error.message);
        } else if (error.message.includes("Failed to send OTP")) {
          sendErrorResponse(
            res,
            MESSAGES.ERROR.AUTH.FAILED_TO_SEND_OTP,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
          );
        } else {
          sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
        }
      } else {
        sendErrorResponse(
          res,
          MESSAGES.ERROR.AUTH.FAILED_TO_REGISTER,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendValidationErrorResponse(
        res,
        MESSAGES.ERROR.AUTH.REQUIRED_EMAIL_PASSWORD
      );
    }
    try {
      const result = await UserService.authenticateUser(email, password);

      // Set cookies with different paths for better security
      CookieUtils.setAuthCookies(
        res,
        result.tokens.accessToken,
        result.tokens.refreshToken,
        result.tokens.expiresIn
      );

      sendSuccessResponse(
        res,
        {
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            role: result.user.role,
            isActive: result.user.isActive,
            createdAt: result.user.createdAt,
          },
          tokens: {
            accessToken: result.tokens.accessToken,
            refreshToken: result.tokens.refreshToken,
            expiresIn: result.tokens.expiresIn,
          },
          message: MESSAGES.SUCCESS.LOGIN_SUCCESS,
        },
        MESSAGES.SUCCESS.LOGIN_SUCCESS
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Sai tài khoản hoặc mật khẩu")) {
          sendValidationErrorResponse(res, error.message);
        } else if (error.message.includes("Tài khoản chưa được xác thực")) {
          sendErrorResponse(res, error.message, HTTP_STATUS.FORBIDDEN);
        } else {
          sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
        }
      } else {
        sendErrorResponse(
          res,
          MESSAGES.ERROR.INTERNAL_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
);

export const logout = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    // Clear all authentication cookies
    CookieUtils.clearAllAuthCookies(res);

    sendSuccessResponse(res, null, MESSAGES.SUCCESS.LOGOUT_SUCCESS);
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Get refresh token from cookies first, then from body as fallback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refreshToken = (req as Request & { refreshToken?: string }).refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return sendValidationErrorResponse(
        res,
        MESSAGES.ERROR.AUTH.REQUIRED_REFRESH_TOKEN
      );
    }

    try {
      const result = await UserService.refreshAccessToken(refreshToken);

      // Set new cookies with different paths
      CookieUtils.setAuthCookies(
        res,
        result.tokens.accessToken,
        result.tokens.refreshToken,
        result.tokens.expiresIn
      );

      sendSuccessResponse(
        res,
        {
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            role: result.user.role,
            isActive: result.user.isActive,
            createdAt: result.user.createdAt,
          },
          tokens: {
            accessToken: result.tokens.accessToken,
            refreshToken: result.tokens.refreshToken,
            expiresIn: result.tokens.expiresIn,
          },
          message: MESSAGES.SUCCESS.AUTH.TOKEN_REFRESHED,
        },
        MESSAGES.SUCCESS.AUTH.TOKEN_REFRESHED
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Invalid refresh token")) {
          sendErrorResponse(res, error.message, HTTP_STATUS.UNAUTHORIZED);
        } else {
          sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
        }
      } else {
        sendErrorResponse(
          res,
          MESSAGES.ERROR.AUTH.FAILED_TO_REFRESH_TOKEN,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
      return sendValidationErrorResponse(
        res,
        MESSAGES.ERROR.AUTH.REQUIRED_EMAIL
      );
    }

    try {
      // This will be implemented when we add password reset functionality
      sendSuccessResponse(
        res,
        { message: MESSAGES.SUCCESS.AUTH.PASSWORD_RESET_EMAIL_SENT },
        MESSAGES.SUCCESS.AUTH.PASSWORD_RESET_EMAIL_SENT
      );
    } catch {
      sendErrorResponse(
        res,
        MESSAGES.ERROR.AUTH.FAILED_TO_SEND_PASSWORD_RESET_EMAIL,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return sendValidationErrorResponse(
        res,
        MESSAGES.ERROR.AUTH.REQUIRED_TOKEN_NEW_PASSWORD
      );
    }

    try {
      // This will be implemented when we add password reset functionality
      sendSuccessResponse(
        res,
        { message: MESSAGES.SUCCESS.AUTH.PASSWORD_RESET_SUCCESS },
        MESSAGES.SUCCESS.AUTH.PASSWORD_RESET_SUCCESS
      );
    } catch {
      sendErrorResponse(
        res,
        MESSAGES.ERROR.AUTH.FAILED_TO_RESET_PASSWORD,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
);
