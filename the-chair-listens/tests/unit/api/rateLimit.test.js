import { Redis } from "@upstash/redis";

const mockRedis = {
    incr: jest.fn(),
    expire: jest.fn()
};

Redis.fromEnv.mockReturnValue(mockRedis);

const { rateLimit } = require("../../../app/lib/rateLimit");

describe("rateLimit", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("allows a request when it is below the limit", async () => {
        mockRedis.incr.mockResolvedValue(1);

        const result = await rateLimit(
            "groq",
            "192.168.1.10",
            10,
            60
        );

        expect(result.allowed).toBe(true);
        expect(result.count).toBe(1);
        expect(result.remaining).toBe(9);
    });

    test("allows the 10th request", async () => {
        mockRedis.incr.mockResolvedValue(10);

        const result = await rateLimit(
            "groq",
            "192.168.1.10",
            10,
            60
        );

        expect(result.allowed).toBe(true);
        expect(result.count).toBe(10);
        expect(result.remaining).toBe(0);
    });

    test("blocks the 11th request", async () => {
        mockRedis.incr.mockResolvedValue(11);

        const result = await rateLimit(
            "groq",
            "192.168.1.10",
            10,
            60
        );

        expect(result.allowed).toBe(false);
        expect(result.count).toBe(11);
        expect(result.remaining).toBe(0);
    });

    test("sets the expiry when the first request is made", async () => {
        mockRedis.incr.mockResolvedValue(1);

        await rateLimit(
            "groq",
            "192.168.1.10",
            10,
            60
        );

        expect(mockRedis.expire).toHaveBeenCalledWith(
            "rate-limit:groq:192.168.1.10",
            60
        );
    });

    test("does not reset expiry on later requests", async () => {
        mockRedis.incr.mockResolvedValue(5);

        await rateLimit(
            "groq",
            "192.168.1.10",
            10,
            60
        );

        expect(mockRedis.expire).not.toHaveBeenCalled();
    });

});

