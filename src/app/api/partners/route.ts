import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';
import crypto from 'crypto';

export async function GET() {
  try {
    const snapshot = await db.collection('partners').get();
    const partners: any[] = [];
    snapshot.forEach((doc) => {
      partners.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return NextResponse.json(partners);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, logoUrl, websiteUrl } = await req.json();
    if (!name || !logoUrl) {
      return NextResponse.json({ error: 'Name and logoUrl are required' }, { status: 400 });
    }
    
    const id = crypto.randomUUID();
    const newPartner = {
      id,
      name,
      logoUrl,
      websiteUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.collection('partners').doc(id).set(newPartner);
    
    return NextResponse.json(newPartner);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, logoUrl, websiteUrl } = await req.json();
    if (!id || !name || !logoUrl) {
      return NextResponse.json({ error: 'ID, name, and logoUrl are required' }, { status: 400 });
    }
    
    const updateData = { 
      name, 
      logoUrl, 
      websiteUrl, 
      updatedAt: new Date().toISOString() 
    };
    
    await db.collection('partners').doc(id).update(updateData);
    
    const doc = await db.collection('partners').doc(id).get();
      
    return NextResponse.json(doc.data());
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await db.collection('partners').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}
