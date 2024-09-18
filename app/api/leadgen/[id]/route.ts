// app/api/leadgen/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const role = req.headers.get('role'); // Get the role from headers

    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        customerFirstName: body.customerFirstName,
        customerLastName: body.customerLastName,
        phoneNumber: body.phoneNumber,
        emailAddress: body.emailAddress,
        propertyAddress: body.propertyAddress,
        city: body.city,
        state: body.state,
        zipcode: body.zipcode,
        homeOwner: body.homeOwner,
        propertyValue: parseFloat(body.propertyValue),
        contractWithRealtor: body.contractWithRealtor,
        // Add any other fields that can be updated
      },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Error updating lead' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const role = req.headers.get('role'); // Get the role from headers

    if (role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Error deleting lead' }, { status: 500 });
  }
}