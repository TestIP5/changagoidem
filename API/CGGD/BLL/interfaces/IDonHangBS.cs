using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.interfaces
{
    public interface IDonHangBS
    {
        int InsertHoaDon(DonHang hoaDon);

        void UpdateHoaDon(TTDonHang hoaDon);

        void UpdateTTHoaDon(TTDonHang2 hoaDon);

        void DeleteHoaDon(int hoaDonID);

        DonHang GetHoaDonByID(int hoaDonID);

        List<DonHang> GetAll();
    }
}
