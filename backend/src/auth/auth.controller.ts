import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            return { status: 401, message: 'Invalid credentials' };
        }
        const tokens = await this.authService.login(user);
        
        // Set refresh token as HTTP-only cookie
        response.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
            access_token: tokens.access_token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    }

    @Post('register')
    async register(@Body() body: RegisterDto, @Res({ passthrough: true }) response: Response) {
        const result = await this.authService.register(body);
        
        response.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            access_token: result.access_token,
            user: result.user
        };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('refresh_token');
        return { message: 'Logged out' };
    }
}
