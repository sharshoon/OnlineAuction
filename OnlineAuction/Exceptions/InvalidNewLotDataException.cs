using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace OnlineAuction.Exceptions
{
    public class InvalidNewLotDataException : Exception
    {
        public ModelStateDictionary ModelState;

        public InvalidNewLotDataException(string message, ModelStateDictionary modelState)
            : base(message)
        {
            ModelState = modelState;
        }
    }
}
