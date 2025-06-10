import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export async function sendExpiryAlert(
  email: string,
  item: {
    name: string;
    expiryDate: Date | null;
    brand?: string;
    quantity: number;
    unit: string;
    location?: string;
  }
) {
  const daysUntilExpiry = Math.ceil(
    (new Date(item.expiryDate!).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const subject =
    daysUntilExpiry <= 1
      ? `⚠️ ${item.name} expires soon!`
      : `📅 ${item.name} expires in ${daysUntilExpiry} days`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444;">${subject}</h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">${item.name}</h3>
        ${
          item.brand
            ? `<p style="margin: 5px 0; color: #666;">Brand: ${item.brand}</p>`
            : ""
        }        <p style="margin: 5px 0;"><strong>Expires:</strong> ${new Date(
    item.expiryDate!
  ).toLocaleDateString()}</p>
        <p style="margin: 5px 0;"><strong>Quantity:</strong> ${item.quantity} ${
    item.unit
  }</p>
        <p style="margin: 5px 0;"><strong>Location:</strong> ${
          item.location
        }</p>
      </div>

      <div style="margin: 20px 0;">
        ${
          daysUntilExpiry <= 1
            ? '<p style="color: #ef4444;"><strong>This item expires tomorrow!</strong> Consider using it in a recipe or consuming it soon.</p>'
            : `<p>This item will expire in ${daysUntilExpiry} days. Plan to use it soon to avoid waste.</p>`
        }
      </div>

      <div style="margin: 30px 0;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard" 
           style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View in Smart Pantry
        </a>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        This is an automated notification from Smart Pantry. 
        <a href="${
          process.env.NEXTAUTH_URL
        }/settings">Manage your notification preferences</a>
      </p>
    </div>
  `;

  return sendEmail(email, subject, html);
}

export async function sendRecipeSuggestion(
  email: string,
  recipe: {
    id: string;
    name: string;
    description?: string;
    cuisine?: string;
    difficulty?: string;
    imageUrl?: string;
    prepTime?: number;
  },
  matchPercentage: number
) {
  const subject = `🍳 Recipe suggestion: ${recipe.name} (${Math.round(
    matchPercentage
  )}% match)`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Recipe Suggestion</h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        ${
          recipe.imageUrl
            ? `<img src="${recipe.imageUrl}" alt="${recipe.name}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 6px; margin-bottom: 15px;">`
            : ""
        }
        
        <h3 style="margin: 0 0 10px 0;">${recipe.name}</h3>
        <p style="margin: 5px 0; color: #666;">${recipe.description || ""}</p>
        
        <div style="display: flex; gap: 20px; margin: 15px 0;">
          <span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
            ${Math.round(matchPercentage)}% Match
          </span>
          ${
            recipe.prepTime
              ? `<span style="color: #666;">⏱️ ${recipe.prepTime} min prep</span>`
              : ""
          }
          ${
            recipe.difficulty
              ? `<span style="color: #666;">📊 ${recipe.difficulty}</span>`
              : ""
          }
        </div>
      </div>

      <p>Based on your current pantry items, you can make this recipe with ${Math.round(
        matchPercentage
      )}% of the ingredients you already have!</p>

      <div style="margin: 30px 0;">
        <a href="${process.env.NEXTAUTH_URL}/recipes/${recipe.id}" 
           style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Recipe
        </a>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        This is an automated suggestion from Smart Pantry. 
        <a href="${
          process.env.NEXTAUTH_URL
        }/settings">Manage your notification preferences</a>
      </p>
    </div>
  `;

  return sendEmail(email, subject, html);
}

export async function sendShoppingListReminder(
  email: string,
  shoppingList: {
    name: string;
    items: Array<{
      name: string;
      quantity: number;
      unit: string;
      isCompleted: boolean;
    }>;
  }
) {
  const subject = `🛒 Shopping reminder: ${shoppingList.name}`;

  const itemsList = shoppingList.items
    .filter((item) => !item.isCompleted)
    .map((item) => `<li>${item.quantity} ${item.unit} ${item.name}</li>`)
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Shopping Reminder</h2>
      
      <p>Don't forget about your shopping list: <strong>${shoppingList.name}</strong></p>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Items to buy:</h3>
        <ul style="margin: 10px 0;">
          ${itemsList}
        </ul>
      </div>

      <div style="margin: 30px 0;">
        <a href="${process.env.NEXTAUTH_URL}/shopping" 
           style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Shopping List
        </a>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        This is an automated reminder from Smart Pantry. 
        <a href="${process.env.NEXTAUTH_URL}/settings">Manage your notification preferences</a>
      </p>
    </div>
  `;

  return sendEmail(email, subject, html);
}
