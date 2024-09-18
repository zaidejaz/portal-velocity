// app/api/leadgen/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateLeadId(firstName: string, lastName: string): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const initials = (firstName[0] + lastName[0]).toUpperCase();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${year}${month}${day}-${initials}${randomNum}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerFirstName,
      customerLastName,
      phoneNumber,
      emailAddress,
      propertyAddress,
      city,
      state,
      zipcode,
      homeOwner,
      propertyValue,
      contractWithRealtor,
      submittedById,
    } = body;

    // Ensure propertyValue is a number
    const parsedPropertyValue = parseFloat(propertyValue);
    if (isNaN(parsedPropertyValue)) {
      return NextResponse.json({ error: 'Invalid property value' }, { status: 400 });
    }

    const leadId = generateLeadId(customerFirstName, customerLastName);

    const lead = await prisma.lead.create({
      data: {
        id: leadId,
        customerFirstName,
        customerLastName,
        phoneNumber,
        emailAddress,
        propertyAddress,
        city,
        state,
        zipcode,
        homeOwner: Boolean(homeOwner),
        propertyValue: parsedPropertyValue,
        contractWithRealtor: Boolean(contractWithRealtor),
        submittedBy: { connect: { id: submittedById } },
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Error creating lead' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const submittedById = searchParams.get('submittedById');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const search = searchParams.get('search') || '';

    if (!submittedById) {
      return NextResponse.json({ error: 'submittedById is required' }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    const where = {
      submittedById,
      OR: [
        { id: { contains: search } },
        { customerFirstName: { contains: search } },
        { customerLastName: { contains: search } },
        { phoneNumber: { contains: search } },
        { emailAddress: { contains: search } },
        { propertyAddress: { contains: search } },
        { city: { contains: search } },
        { state: { contains: search } },
        { zipcode: { contains: search } },
      ],
    };

    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { submissionDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      leads,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Error fetching leads' }, { status: 500 });
  }
}