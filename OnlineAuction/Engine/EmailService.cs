using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public class EmailService : IEmailService
    {
        public async Task SendEmailToWinnerAsync(string email,string name, Lot lot, int price)
        {
            var emailMessage = new MimeMessage();
            
            emailMessage.From.Add(new MailboxAddress("Online Auction", "online.auction.sharshun@gmail.com"));
            emailMessage.To.Add(new MailboxAddress("", "sharshoon321@gmail.com"));
            emailMessage.Subject = "Winner instructions";
            emailMessage.Body = new BodyBuilder
            {
                HtmlBody = $"<h1>Hello {name}</h1>" +
                           $"<p>We are pleased to inform you that you have become the winner of the {lot.Name } lot</p>" +
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
            await client.AuthenticateAsync("online.auction.sharshun@gmail.com", "onlineauction");
            await client.SendAsync(emailMessage);

            await client.DisconnectAsync(true);
        }
    }
}
