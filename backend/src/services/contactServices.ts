import { prisma } from "../prisma";
import { Contact } from "@prisma/client";
export const identifyContact = async (
  email?: string,
  phoneNumber?: string
) => {

  return await prisma.$transaction(async (tx) => {

    // 1️⃣ Find matching contacts
    const matchingContacts = await tx.contact.findMany({
      where: {
        OR: [
          { email: email ?? undefined },
          { phoneNumber: phoneNumber ?? undefined }
        ]
      },
      orderBy: { createdAt: "asc" }
    });

    // 2️⃣ If no contacts exist → create primary
    if (matchingContacts.length === 0) {
      const newContact = await tx.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: "primary"
        }
      });

      return formatResponse(tx, newContact.id);
    }

    // 3️⃣ Extract primary contacts
    const primaryContacts = matchingContacts.filter(
      (c) => c.linkPrecedence === "primary"
    );

    let primary = primaryContacts[0];

    // 4️⃣ If multiple primaries → merge them
    if (primaryContacts.length > 1) {
      primary = primaryContacts[0]; // oldest

      for (let i = 1; i < primaryContacts.length; i++) {
        await tx.contact.update({
          where: { id: primaryContacts[i].id },
          data: {
            linkPrecedence: "secondary",
            linkedId: primary.id
          }
        });
      }
    }

    // 5️⃣ Check if exact match exists
    const exactMatch = matchingContacts.find(
      (c) =>
        c.email === email &&
        c.phoneNumber === phoneNumber
    );

    // 6️⃣ If new info → create secondary
    if (!exactMatch) {
      await tx.contact.create({
        data: {
          email,
          phoneNumber,
          linkedId: primary.id,
          linkPrecedence: "secondary"
        }
      });
    }

    return formatResponse(tx, primary.id);
  });
};

const formatResponse = async (tx: any, primaryId: number) => {

  const contacts: Contact[] = await tx.contact.findMany({
    where: {
      OR: [
        { id: primaryId },
        { linkedId: primaryId }
      ]
    },
    orderBy: { createdAt: "asc" }
  });

  const primary = contacts[0];

  return {
    contact: {
      primaryContatctId: primary.id,
      emails: [
        ...new Set(
          contacts.map((c: Contact) => c.email).filter(Boolean)
        )
      ],
      phoneNumbers: [
        ...new Set(
          contacts.map((c: Contact) => c.phoneNumber).filter(Boolean)
        )
      ],
      secondaryContactIds: contacts
        .filter((c: Contact) => c.linkPrecedence === "secondary")
        .map((c: Contact) => c.id)
    }
  };
};