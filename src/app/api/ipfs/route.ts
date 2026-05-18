import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const projectId = process.env.BLOCKFROST_IPFS_PROJECT_ID;
        if (!projectId) {
            return NextResponse.json({ error: 'Blockfrost Project ID not configured' }, { status: 500 });
        }

        // Prepare the multipart form data for Blockfrost
        const blockfrostFormData = new FormData();
        // Passing the File object directly preserves its MIME type and name
        blockfrostFormData.append('file', file);

        const response = await fetch('https://ipfs.blockfrost.io/api/v0/ipfs/add', {
            method: 'POST',
            headers: {
                'project_id': projectId,
            },
            body: blockfrostFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Blockfrost IPFS error:', errorText);
            return NextResponse.json({ error: 'Failed to upload to IPFS' }, { status: response.status });
        }

        const data = await response.json();
        const ipfsHash = data.ipfs_hash;

        // 2. Explicitly pin the object to ensure it's not garbage collected
        const pinResponse = await fetch(`https://ipfs.blockfrost.io/api/v0/ipfs/pin/add/${ipfsHash}`, {
            method: 'POST',
            headers: {
                'project_id': projectId,
            },
        });

        if (!pinResponse.ok) {
            const pinErrorText = await pinResponse.text();
            console.error('Blockfrost IPFS Pin Error:', pinErrorText);
            return NextResponse.json({ error: 'Failed to pin to IPFS' }, { status: pinResponse.status });
        }
        
        // Blockfrost returns { name: string, ipfs_hash: string, size: string }
        return NextResponse.json({ 
            ipfsHash: ipfsHash,
            name: data.name
        });

    } catch (error) {
        console.error('IPFS Upload Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
