import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string; timestamp: string; version: string } {
    return {
      message: 'PTime API - Employee Gig Platform',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}
