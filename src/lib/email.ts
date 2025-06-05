import { supabase } from './supabase';

type EmailOptions = {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  metadata?: Record<string, any>;
  emailType?: string;
};

/**
 * Send an email using SendGrid through our Supabase Edge Function
 */
export async function sendEmail(options: EmailOptions) {
  const { to, subject, text, html, templateId, dynamicTemplateData, metadata, emailType = 'notification' } = options;
  
  try {
    // Store the email request in our database for tracking
    const { data: emailRecord, error: dbError } = await supabase
      .from('email_notifications')
      .insert({
        email_type: emailType,
        recipient: to,
        subject,
        content: html || text || 'Template email',
        status: 'pending',
        metadata
      })
      .select()
      .single();
      
    if (dbError) {
      console.error('Error logging email:', dbError);
    }
    
    // Call the Supabase Edge Function for sending emails
    try {
      const response = await fetch(
        'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/4540a722-6245-44fc-aa15-074bbf25fd06',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to,
            from: 'hello@critvidapp.com', // Using the verified sender from settings
            subject: subject || 'CritVid App Notification',
            content: html || text || 'This is a notification from CritVid App.',
            contentType: 'text/html'
          }),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null) || await response.text();
        console.error('Email API response error:', errorData);
        
        // Update the email status in the database
        if (emailRecord?.id) {
          await supabase
            .from('email_notifications')
            .update({ 
              status: 'failed', 
              error_message: typeof errorData === 'string' ? errorData : JSON.stringify(errorData)
            })
            .eq('id', emailRecord.id);
        }
        
        return { success: false, error: errorData };
      }
      
      const result = await response.json();
      
      // Update the email status in the database
      if (result.success && emailRecord?.id) {
        await supabase
          .from('email_notifications')
          .update({ status: 'sent' })
          .eq('id', emailRecord.id);
      }
      
      return { success: true, data: result };
    } catch (fetchError) {
      console.error('Fetch error when sending email:', fetchError);
      
      // Update the email status in the database
      if (emailRecord?.id) {
        await supabase
          .from('email_notifications')
          .update({ status: 'failed', error_message: fetchError.message })
          .eq('id', emailRecord.id);
      }
      
      return { success: false, error: fetchError.message };
    }
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: 'Welcome to CritVid App',
    html: `<h1>Welcome to CritVid App, ${name}!</h1><p>Thank you for joining our platform.</p>`,
    emailType: 'welcome'
  });
}

/**
 * Send a notification when a critique is ready
 */
export async function sendCritiqueReadyEmail(email: string, name: string, videoTitle: string) {
  return sendEmail({
    to: email,
    subject: 'Your Critique is Ready',
    html: `<h1>Hello ${name},</h1><p>Your critique for "${videoTitle}" is now ready to view!</p>`,
    emailType: 'critique_ready'
  });
}
