import handler from "../../../app/pages/api/groq";
import { rateLimit, getClientIp } from "../../../app/lib/rateLimit";

jest.mock("../../../app/lib/rateLimit", () => ({
    rateLimit: jest.fn(),
    getClientIp: jest.fn()
}));

describe("/api/groq rate limiting", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("allows the request when rate limit has not been exceeded", async () => {
        getClientIp.mockReturnValue("192.168.1.10");

        rateLimit.mockResolvedValue({
            allowed: true,
            remaining: 9,
            count: 1
        });

        const req = {
            method: "POST",
            headers: {},
            body: {
                message: "Hello"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await handler(req, res);

        expect(rateLimit).toHaveBeenCalledWith(
            "groq",
            "192.168.1.10",
            10,
            60
        );

        expect(res.status).not.toHaveBeenCalledWith(429);
    });

    test("returns 429 when rate limit is exceeded", async () => {
        getClientIp.mockReturnValue("192.168.1.10");

        rateLimit.mockResolvedValue({
            allowed: false,
            remaining: 0,
            count: 11
        });

        const req = {
            method: "POST",
            headers: {},
            body: {
                message: "Hello"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(429);

        expect(res.json).toHaveBeenCalledWith({
            error: "Too many requests. Please try again later."
        });
    });

});
