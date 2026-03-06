using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class SanPham
    {
        public int MaSanPham { get; set; }

        public int MaDanhMuc { get; set; }

        public string TenSanPham { get; set; }

        public float Gia { get; set; }

        public string MoTa {  get; set; }

        public int Stt { get; set; }

        public string Anh { get; set; }


    }

    public class SanPhamAdd
    {

        public int MaDanhMuc { get; set; }

        public string TenSanPham { get; set; }

        public float Gia { get; set; }

        public string MoTa { get; set; }

        public string Anh { get; set; }


    }
}
