export class Sanitizer {
    static removeNonAlphanumeric(input: string): string {
        const regex = /[^a-zA-Z0-9]/g;
        return input.replace(regex, '');
    }
}