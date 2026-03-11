import { Request, Response } from 'express';
import { UserService } from '@/services/user.service';

import { sendSuccessResponse, sendErrorResponse, sendValidationErrorResponse, sendNotFoundResponse } from '@/utils/responseFormatter';
import { 
  validateId,
  validateStringField,
  validateEmail,
  validatePassword
} from '@/utils/validation';
import { MESSAGES } from '@/constants';
import { asyncHandler } from '@/middlewares/error';
import { AuthenticatedRequest } from '@/types';

export const getAllUsers = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const users = await UserService.getAllUsers();
  sendSuccessResponse(res, users, MESSAGES.SUCCESS.FETCHED);
});

export const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  // Validate ID
  const idValidation = validateId(id, 'User ID');
  if (!idValidation.isValid) {
    return sendValidationErrorResponse(res, idValidation.error!);
  }
  
  const user = await UserService.getUserById(idValidation.value!);
  if (!user) {
    return sendNotFoundResponse(res, MESSAGES.ERROR.USER.USER_NOT_FOUND);
  }
  
  sendSuccessResponse(res, user, MESSAGES.SUCCESS.FETCHED);
});

export const getUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendErrorResponse(res, MESSAGES.ERROR.AUTH.REQUIRED_AUTH);
    }

    const user = await UserService.getUserProfile(userId);
    if (!user) {
      return sendNotFoundResponse(res, MESSAGES.ERROR.USER.USER_NOT_FOUND);
    }

    sendSuccessResponse(res, user, MESSAGES.SUCCESS.USER.GET_USER_PROFILE_SUCCESS);
  } catch (error) {
    if (error instanceof Error) {
      sendErrorResponse(res, error.message);
    } else {
      sendErrorResponse(res, MESSAGES.ERROR.INTERNAL_ERROR);
    }
  }
});

export const updateUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendErrorResponse(res, MESSAGES.ERROR.AUTH.REQUIRED_AUTH);
    }

    const { username, email } = req.body;
    
    const updateData: { username?: string; email?: string } = {};
    
    // Validate optional fields
    if (username !== undefined) {
      const usernameValidation = validateStringField(username, 'Username', true);
      if (!usernameValidation.isValid) {
        return sendValidationErrorResponse(res, usernameValidation.error!);
      }
      updateData.username = usernameValidation.value!;
    }
    
    if (email !== undefined) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return sendValidationErrorResponse(res, emailValidation.error!);
      }
      updateData.email = email;
    }


    const updatedUser = await UserService.updateUserProfile(userId, updateData);
    if (!updatedUser) {
      return sendNotFoundResponse(res, MESSAGES.ERROR.USER.USER_NOT_FOUND);
    }

    sendSuccessResponse(res, updatedUser, MESSAGES.SUCCESS.USER.UPDATE_USER_PROFILE_SUCCESS);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        sendValidationErrorResponse(res, error.message);
      } else {
        sendErrorResponse(res, error.message);
      }
    } else {
      sendErrorResponse(res, MESSAGES.ERROR.USER.PROFILE_UPDATE_FAILED);
    }
  }
});

export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendErrorResponse(res, MESSAGES.ERROR.AUTH.REQUIRED_AUTH);
    }

    const { currentPassword, newPassword } = req.body;
    
    // Validate current password
    const currentPasswordValidation = validateStringField(currentPassword, 'Current Password', true);
    if (!currentPasswordValidation.isValid) {
      return sendValidationErrorResponse(res, currentPasswordValidation.error!);
    }
    
    // Validate new password
    const newPasswordValidation = validatePassword(newPassword);
    if (!newPasswordValidation.isValid) {
      return sendValidationErrorResponse(res, newPasswordValidation.error!);
    }

    const success = await UserService.changePassword(userId, currentPasswordValidation.value!, newPassword);
    if (!success) {
      return sendNotFoundResponse(res, MESSAGES.ERROR.USER.USER_NOT_FOUND);
    }

    sendSuccessResponse(res, { message: MESSAGES.SUCCESS.USER.PASSWORD_CHANGE_SUCCESS }, MESSAGES.SUCCESS.USER.PASSWORD_CHANGE_SUCCESS);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('incorrect')) {
        sendValidationErrorResponse(res, error.message);
      } else {
        sendErrorResponse(res, error.message);
      }
    } else {
      sendErrorResponse(res, MESSAGES.ERROR.USER.PASSWORD_CHANGE_FAILED);
    }
  }
});