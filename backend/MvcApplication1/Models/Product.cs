using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace MvcApplication1.Models
{
    public class Product
    {
        public int ProductId {get; set;}
        public string Name { get; set; }
        public int UnitsInStock { get; set; }
        public int CategoryID { get; set; }

        [Column(TypeName="money")]
        public decimal Unitprice { get; set; }
    }
}
