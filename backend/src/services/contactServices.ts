import { prisma } from "../prisma";

export const identifyContact = async (email?: string, phoneNumber?: string) => {

  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email ?? undefined },
        { phoneNumber: phoneNumber ?? undefined }
      ]
    }
  });

  if (existingContacts.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary"
      }
    });

    return formatResponse(newContact.id);
  }

  // Find primary contact
  let primary = existingContacts.find(c => c.linkPrecedence === "primary") 
              || existingContacts[0];

  // If new info present → create secondary
  const alreadyExists = existingContacts.some(
    c => c.email === email && c.phoneNumber === phoneNumber
  );

  if (!alreadyExists) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primary.id,
        linkPrecedence: "secondary"
      }
    });
  }

  return formatResponse(primary.id);
};

const formatResponse = async (primaryId: number) => {

  const allContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primaryId },
        { linkedId: primaryId }
      ]
    },
    orderBy: { createdAt: "asc" }
  });

  const primary = allContacts[0];

  return {
    contact: {
      primaryContatctId: primary.id,
      emails: [...new Set(allContacts.map(c => c.email).filter(Boolean))],
      phoneNumbers: [...new Set(allContacts.map(c => c.phoneNumber).filter(Boolean))],
      secondaryContactIds: allContacts
        .filter(c => c.linkPrecedence === "secondary")
        .map(c => c.id)
    }
  };
};