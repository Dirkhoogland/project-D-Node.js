export class PasswordService {
    private static dbConfig: any;

    static init(entities: any[]): void {
        PasswordService.dbConfig = {
            type: 'mssql',
            host: '77.170.251.180',
            port: 1433,
            username: 'Mex',
            password: 'Mex14',
            database: 'FlightDB',
            entities: entities,
            synchronize: false,
            options: {
                encrypt: false,
                trustServerCertificate: true,
            },
        };
    }

    // Static method to get the configuration
    static getConfig(): any {
        return PasswordService.dbConfig;
    }
}
