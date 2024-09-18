// app/api/realtor/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const realtorId = searchParams.get('realtorId');

    if (!realtorId) {
      return NextResponse.json({ error: 'realtorId is required' }, { status: 400 });
    }

    const availableLeads = await prisma.lead.findMany({
      where: {
        status: 'ACCEPTED',
        leadAssignments: {
          some: {
            realtorId: realtorId
          }
        }
      },
      orderBy: { submissionDate: 'desc' },
    });

    return NextResponse.json(availableLeads);
  } catch (error) {
    console.error('Error fetching available leads:', error);
    return NextResponse.json({ error: 'Error fetching available leads' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, status, comment } = body;

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { status },
    });

    // If you want to store comments, you might need to create a new model for comments
    // and create a new comment entry here

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Error updating lead' }, { status: 500 });
  }
}