using BLL.interfaces;
using DAL;
using DAL.Interfaces;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class DonHangBS : IDonHangBS
    {
        private IDonHangRP _iHoaDon;
        public DonHangBS(IDonHangRP _iHoaDonDAL)
        {
            _iHoaDon = _iHoaDonDAL ?? throw new ArgumentNullException(nameof(_iHoaDonDAL));
        }
        public void DeleteHoaDon(int hoaDonID)
        {
            _iHoaDon.DeleteHoaDon(hoaDonID);
        }

        public DonHang GetHoaDonByID(int hoaDonID)
        {
            return _iHoaDon.GetHoaDonByID(hoaDonID);
        }

        public int InsertHoaDon(DonHang hoaDon)
        {
            return _iHoaDon.InsertHoaDon(hoaDon);
        }

        public void UpdateHoaDon(TTDonHang hoaDon)
        {
            _iHoaDon.UpdateHoaDon(hoaDon);
        }

        public void UpdateTTHoaDon(TTDonHang2 hoaDon)
        {
            _iHoaDon.UpdateTTHoaDon(hoaDon);
        }

        public List<DonHang> GetAll()
        {
            return _iHoaDon.GetAll();
        }
    }
}
