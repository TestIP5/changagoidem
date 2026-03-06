using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class DbUlits
    {
        public static readonly string conString = @"Data Source=LAPTOP-SALH06JC\SQLEXPRESS;Initial Catalog=changoiprovip;Integrated Security=True;TrustServerCertificate=True";

        public static SqlConnection GetConnection()
        {
            return new SqlConnection(conString);
        }
    }
}
