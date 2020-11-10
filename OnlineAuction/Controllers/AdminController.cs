using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace OnlineAuction.Controllers
{
    [Route("api/admin-panel")]
    [Authorize(Policy = "IsAdmin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        [HttpGet]
        public Task Get()
        {
            var response = JsonConvert.SerializeObject(new TestResult());
            return Response.WriteAsync(response);
        }
    }

    public class TestResult
    {
        public string message = "Message from admin controller";
    }
}
