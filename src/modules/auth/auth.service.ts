import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.ts';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, password } = registerDto;

    try {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        this.logger.warn(`Registration attempt with existing email: ${email}`);
        throw new ConflictException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      this.logger.log(`User registered successfully: ${email}`);
      return { message: 'User registered successfully' };
    } catch (error) {
      this.logger.error(`Failed to register user: ${email}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to register user',
        error.message,
      );
    }
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user || !(await user.validatePassword(password))) {
        this.logger.warn(`Invalid login attempt: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.log(`User logged in successfully: ${email}`);
      return this.generateToken(user);
    } catch (error) {
      this.logger.error(`Failed to login user: ${email}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to login user',
        error.message,
      );
    }
  }

  private generateToken(user: User): { accessToken: string } {
    const payload = { userId: user.id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
