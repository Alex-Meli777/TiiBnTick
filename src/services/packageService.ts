export interface PackageCreationPayload {
    [key: string]: any;
}

export const packageService = {
    createPackage: async (data: any) => {
        console.log('Mock createPackage called', data);
        return { success: true, id: 'mock-id' };
    }
};
