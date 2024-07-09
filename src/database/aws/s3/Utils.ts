"use server"

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { FileTypeResult, fileTypeFromBuffer } from "file-type";

const { AWS_S3_BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

if (!AWS_S3_BUCKET_NAME || !AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error("Missing AWS configuration");
}

const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

export const uploadImage = async (file: Buffer): Promise<string> => {
    const fileType: FileTypeResult | undefined = await fileTypeFromBuffer(file);

    if (!fileType) {
        throw new Error("Unable to determine file type");
    }

    const keyName = `product/${uuidv4()}.${fileType.ext}`;

    const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: keyName,
        Body: file,
        ContentType: fileType.mime,
        ACL: "private" as const,
    };

    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        return keyName;
    } catch (error) {
        console.error("Error uploading image: ", error);
        throw new Error("Error uploading image");
    }
}

export const getImageUrl = async (key: string): Promise<string> => {
    const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key,
    };

    try {
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 });
        return url;
    } catch (error) {
        console.error("Error retrieving image URL: ", error);
        throw new Error("Error retrieving image URL");
    }
}

export const deleteImage = async (key: string): Promise<void> => {
    const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key,
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
    } catch (error) {
        console.error("Error deleting image from S3: ", error);
        throw new Error("Error deleting image");
    }
};
