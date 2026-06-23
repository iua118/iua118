import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, phone, department } = registerDto;

    // Kiểm tra user đã tồn tại
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        department,
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    // Trả token
    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Tìm user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra status
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Tài khoản không hoạt động');
    }

    // Trả token
    return this.generateTokens(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async getCurrentUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        department: true,
        status: true,
      },
    });
  }

  private generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION || '7d',
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}
