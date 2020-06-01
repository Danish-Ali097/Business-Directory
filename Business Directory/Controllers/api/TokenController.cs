﻿using Business_Directory.Models;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Web.Http;

namespace Business_Directory.Controllers.api
{
    public class TokenController : ApiController
    {
        static string KEY = "thisismysecretkeyforauthenticationofuser12345";
        private business_directorydbEntities1 db = new business_directorydbEntities1(); 
        [HttpPost]
        public Object GetToken(string userName, string password)
        {
            bool validuser = false;
            if (userName.Length < 1 || password.Length < 1) return BadRequest("Credentials can't be empty");

            var res = db.Users.ToList<User>();
            foreach(var x in res)
            {
                if(x.UserName.Equals(userName) && x.Password.Equals(password))
                {
                    validuser = true;
                }
                else
                {
                    return BadRequest("Incorrect Cradentials");
                }
            }
            if (validuser)
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var permClaim = new Claim[] {
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("UserName",userName)};

                var token = new JwtSecurityToken(
                    claims: permClaim,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: credentials);

                var jwt_token = new JwtSecurityTokenHandler().WriteToken(token);
                return new { auth_token = jwt_token };
            }
            return BadRequest("An error has occured");
        }
    }
}
