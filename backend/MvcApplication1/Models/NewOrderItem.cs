using MvcApplication1.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MvcApplication1.Models
{
    public class NewOrderItem
    {
        public int ProductId { get; set; }
        public int Count { get; set; }
    }
}