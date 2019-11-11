using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace MvcApplication1.Models
{
    public class NewProduct
    {
        public string Name { get; set; }
        public int UnitsInStock { get; set; }
        public decimal Unitprice { get; set; }
    }
}
