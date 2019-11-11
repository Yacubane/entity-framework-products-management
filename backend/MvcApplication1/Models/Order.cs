using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MvcApplication1.Models
{
    public class Order
    {
        public int OrderId { get; set; }

        public string CompanyName { get; set; }
        [ForeignKey("CompanyName")]
        public Customer Customer { get; set; }

        public virtual List<OrderItem> OrderItems { get; set; }
    }
}