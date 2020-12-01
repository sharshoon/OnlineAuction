using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public class EmailService : IEmailService
    {
        private readonly string _emailSender;
        private readonly string _emailSenderPassword;
        public EmailService(IConfiguration configuration)
        {
            _emailSender = configuration.GetConnectionString("EmailSender");
            _emailSenderPassword = configuration.GetConnectionString("EmailSenderPassword");
        }

        private const string TitleClasses = "\"font-size: 1.4rem;\"";

        public async Task SendEmailToWinnerAsync(string email,string name, Lot lot, int price)
        {
            var emailMessage = new MimeMessage();
            
            emailMessage.From.Add(new MailboxAddress("Online Auction", _emailSender));
            emailMessage.To.Add(new MailboxAddress("", "sharshoon321@gmail.com"));
            emailMessage.Subject = "Winner instructions";
            emailMessage.Body = new BodyBuilder
            {
                HtmlBody = $"<h1 style={TitleClasses}>Hello {name}</h1>" +
                           $"<p>We are pleased to inform you that you have become the winner of the {lot.Name} lot</p>" +
                           "<p>Lot characteristics:</p>" +
                           "<ul>" +
                           $"   <li>Name: {lot.Name}</li>" +
                           $"   <li>Description: {lot.Description}</li>"  +
                           $"   <li>Price: {price} USD</li>"  +
                           $"</ul>" +
                           $"<p>Your order will arrive at your place very soon!</p>"
            }.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync("smtp.gmail.com", 587);
            client.AuthenticationMechanisms.Remove("XOAUTH2");
            await client.AuthenticateAsync(_emailSender, _emailSenderPassword);
            await client.SendAsync(emailMessage);

            await client.DisconnectAsync(true);
        }
    }
}
