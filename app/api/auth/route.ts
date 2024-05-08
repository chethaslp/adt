import {OAuth2Client} from "google-auth-library"

import { db } from "@/components/fb/config";
import { doc, getDoc, collection, setDoc, getDocs, query, where, getFirestore} from "firebase/firestore";
import { NextResponse } from "next/server";
import keys from "@/keys.json"


export async function POST(req: Request) {

    const { code, uid }  = await req.json()
  
    if (!code || !uid) {
      return NextResponse.json(
        { msg: 'Missing required arguments.' },
        { status: 400 }
      );
    }
    const oAuth2Client = new OAuth2Client(
        keys.web.client_id,
        keys.web.client_secret,
        "http://localhost:3000/api/auth"

      );
    const r = await oAuth2Client.getToken(code);
  
    return NextResponse.json({
      at: r.tokens.access_token,
      rt: r.tokens.refresh_token,
      exp: r.tokens.expiry_date});
  }