/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";
import { AIFormField } from "@/interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function  extractJSON(responseText: string) {
  // For Reasoning Models, remove the think tags and extract the JSON
  const withoutThink = responseText.replace(/<think>[\s\S]*?<\/think>/g, '');
  const jsonStart = withoutThink.indexOf('{');
  const jsonEnd = withoutThink.lastIndexOf('}');
  try {
    // Extract the JSON string
    if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
      console.error('No valid JSON found in the response text.');
    }
    const jsonString = withoutThink.substring(jsonStart, jsonEnd + 1).trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

export function getBaseUrl() {
  // Check if we have an explicit site URL set
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // For Vercel production and preview deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Additional check for NEXT_PUBLIC_VERCEL_URL
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  return process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SITE_URL
    : `http://localhost:${process.env.PORT || 3000}`;
}

export function buildZodSchema(fields: AIFormField[]) {
  const zodSchema: Record<string, any> = {};
  fields.forEach((field) => {
    let validator = z.string();
    if (field.type === "email") {
      validator = z.string().email("Invalid email address");
    }

    if (field.validations) {
      const { minLength, maxLength, pattern } = field.validations;
      if (minLength) validator = validator.min(minLength, `Min ${minLength} characters`);
      if (maxLength) validator = validator.max(maxLength, `Max ${maxLength} characters`);
      if (pattern) validator = validator.regex(new RegExp(pattern), "Invalid format");
    }

    if (field.required) {
      zodSchema[field.id] = validator.nonempty(`${field.label} is required`);
    } else {
      zodSchema[field.id] = validator.optional();
    }
  });
  return z.object(zodSchema);
}

export const swrFetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())