import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { LoginDto } from './dto/login.dto';
import {
  createInvalidCredentialsError,
  createEmailNotVerifiedError,
  createInvalidVerificationTokenError,
  createEmailAlreadyVerifiedError,
  createEmailExistsAuthError,
  createEmailSendFailedError,
} from '../../common/errors/app-errors';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Check if email is verified
      if (!user.emailVerified) {
        throw createEmailNotVerifiedError();
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw createInvalidCredentialsError();
    }

    const payload = {
      username: user.username,
      sub: user.id,
      roleType: user.roleType,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        roleType: user.roleType,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    try {
      const result = await this.usersService.prisma.$transaction(async (tx) => {
        const user = await this.usersService.create(
          {
            email: registerDto.email,
            username: registerDto.email,
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            role: 'support',
          },
          tx,
        );

        // Send email verification within transaction
        await this.sendEmailVerification(user.email, user.id);

        return user;
      });

      const { password, ...userResult } = result;
      return userResult;
    } catch (error) {
      throw error;
    }
  }

  private getTransporter() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmailVerification(email: string, userId: number) {
    const transporter = this.getTransporter();

    // Create JWT token for email verification
    const verificationToken = this.jwtService.sign(
      { userId, email, type: 'email_verification' },
      { expiresIn: '24h' }
    );

    const frontendUrl = process.env.FRONTEND_URL;
    const verificationUrl = `${frontendUrl}?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'Email Verification - Please Verify Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome! Please Verify Your Email</h2>
          <p>Thank you for registering! Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw createEmailSendFailedError();
    }
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'email_verification') {
        throw createInvalidVerificationTokenError();
      }

      const user = await this.usersService.findById(payload.userId);

      if (user.emailVerified) {
        throw createEmailAlreadyVerifiedError();
      }

      // Update user verification status
      await this.usersService.updateEmailVerification(payload.userId, true);

      return {
        success: true,
        message: 'Email verified successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw createInvalidVerificationTokenError();
      }
      throw error;
    }
  }
}
