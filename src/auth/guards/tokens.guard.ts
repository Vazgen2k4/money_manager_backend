import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class AccessGuard extends AuthGuard('jwt-access') {}

@Injectable()
export class RefreshGuard extends AuthGuard('jwt-refresh') {}
