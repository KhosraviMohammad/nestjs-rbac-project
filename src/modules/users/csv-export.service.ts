import { Injectable } from '@nestjs/common';
import * as createCsvWriter from 'csv-writer';
import { User } from '@prisma/client';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class CsvExportService {
  private ensureTempDirExists(): string {
    const tempDir = path.resolve(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    return tempDir;
  }
  async exportUsersToCsv(users: User[]): Promise<Buffer> {
    const tempDir = this.ensureTempDirExists();
    const filePath = path.join(tempDir, 'users.csv');
    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'email', title: 'Email' },
        { id: 'username', title: 'Username' },
        { id: 'firstName', title: 'First Name' },
        { id: 'lastName', title: 'Last Name' },
        { id: 'roleType', title: 'Role Type' },
        { id: 'isActive', title: 'Is Active' },
        { id: 'emailVerified', title: 'Email Verified' },
        { id: 'emailVerifiedAt', title: 'Email Verified At' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'updatedAt', title: 'Updated At' },
      ],
    });

    // Transform users data for CSV
    const csvData = users.map(user => ({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      roleType: user.roleType,
      isActive: user.isActive ? 'Yes' : 'No',
      emailVerified: user.emailVerified ? 'Yes' : 'No',
      emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : '',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    await csvWriter.writeRecords(csvData);

    // Read the generated CSV file and return as Buffer
    const csvContent = fs.readFileSync(filePath);
    
    // Clean up the temporary file
    fs.unlinkSync(filePath);
    
    return csvContent;
  }

  async exportUsersToCsvStream(users: User[]): Promise<string> {
    const tempDir = this.ensureTempDirExists();
    const filePath = path.join(tempDir, 'users.csv');
    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'email', title: 'Email' },
        { id: 'username', title: 'Username' },
        { id: 'firstName', title: 'First Name' },
        { id: 'lastName', title: 'Last Name' },
        { id: 'roleType', title: 'Role Type' },
        { id: 'isActive', title: 'Is Active' },
        { id: 'emailVerified', title: 'Email Verified' },
        { id: 'emailVerifiedAt', title: 'Email Verified At' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'updatedAt', title: 'Updated At' },
      ],
    });

    // Transform users data for CSV
    const csvData = users.map(user => ({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      roleType: user.roleType,
      isActive: user.isActive ? 'Yes' : 'No',
      emailVerified: user.emailVerified ? 'Yes' : 'No',
      emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : '',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    await csvWriter.writeRecords(csvData);

    // Read the generated CSV file and return as string
    const csvContent = fs.readFileSync(filePath, 'utf8');
    
    // Clean up the temporary file
    fs.unlinkSync(filePath);
    
    return csvContent;
  }
}
