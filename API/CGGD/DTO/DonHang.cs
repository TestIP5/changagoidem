using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class DonHang
    {
        public int MaDonHang { get; set; }

        public string TaiKhoan { get; set; }

        public string DiaChi { get; set; }

        public DateTime NgayDat { get; set; }

        public string TrangThai { get; set; }

        public int Stt { get; set; }

        public string SoDienThoai { get; set; }

        public string HoTen { get; set; }
    }

    public class TTDonHang
    {
        public int MaDonHang { get; set; }

        public string TrangThai { get; set; }

    }

    public class TTDonHang2
    {
        public int MaDonHang { get; set; }

        public string DiaChi { get; set; }

        public string SoDienThoai { get; set; }

        public string HoTen { get; set; }
    }
}
