// app/api/admin/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const model = searchParams.get('model');

    let data;
    switch (model) {
      case 'users':
        data = await prisma.user.findMany();
        break;
      case 'leads':
        data = await prisma.lead.findMany();
        break;
      case 'realtors':
        data = await prisma.realtor.findMany();
        break;
      default:
        return NextResponse.json({ error: 'Invalid model specified' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { model, id, data } = body;

    let updatedData;
    switch (model) {
      case 'users':
        updatedData = await prisma.user.update({ where: { id }, data });
        break;
      case 'leads':
        updatedData = await prisma.lead.update({ where: { id }, data });
        break;
      case 'realtors':
        updatedData = await prisma.realtor.update({ where: { id }, data });
        break;
      default:
        return NextResponse.json({ error: 'Invalid model specified' }, { status: 400 });
    }

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Error updating data' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const model = searchParams.get('model');
    const id = searchParams.get('id');

    if (!model || !id) {
      return NextResponse.json({ error: 'Model and ID are required' }, { status: 400 });
    }

    let result;
    switch (model) {
      case 'users':
        result = await prisma.user.delete({ where: { id } });
        break;
      case 'leads':
        result = await prisma.lead.delete({ where: { id } });
        break;
      case 'realtors':
        result = await prisma.realtor.delete({ where: { id } });
        break;
      default:
        return NextResponse.json({ error: 'Invalid model specified' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ error: 'Error deleting data' }, { status: 500 });
  }
}