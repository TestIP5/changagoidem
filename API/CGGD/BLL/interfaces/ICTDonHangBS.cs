using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.interfaces
{
    public interface ICTDonHangBS
    {
        void InsertChiTietHoaDon(ChiTietDonHang chiTietHD);

        void UpdateChiTietHoaDon(ChiTietDonHang chiTietHD);

        void DeleteChiTietHoaDon(int chiTietHDID);

        List<ChiTietDonHang> GetCTHoaDonByID(int ctHoaDonID);

        List<ChiTietDonHang> GetAll();
    }
}
