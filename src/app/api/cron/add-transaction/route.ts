import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { tx_hash } = body;

        if (!tx_hash || typeof tx_hash !== "string") {
            return Response.json(
                { error: "tx_hash is required" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("transactions")
            .insert({
                tx_hash,
                status: "pending",
            })
            .select()
            .single();

        if (error) {
            // Handle duplicate tx_hash gracefully (unique constraint)
            if (error.code === "23505") {
                return Response.json(
                    { error: "Transaction already exists" },
                    { status: 409 }
                );
            }

            throw error;
        }

        return Response.json({
            success: true,
            transaction: data,
        });
    } catch (error) {
        console.error("POST /transactions error:", error);
        return Response.json(
            { error: "Failed to store transaction" },
            { status: 500 }
        );
    }
}