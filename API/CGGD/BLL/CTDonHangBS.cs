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
    public class CTDonHangBS : ICTDonHangBS
    {
        private ICTDonHangRP _iCTHoaDon;

        public CTDonHangBS(ICTDonHangRP _iCTHoaDonDAL)
        {
            _iCTHoaDon = _iCTHoaDonDAL ?? throw new ArgumentNullException(nameof(_iCTHoaDonDAL));
        }

        public void DeleteChiTietHoaDon(int mahd,int masp)
        {
             _iCTHoaDon.DeleteChiTietHoaDon( mahd, masp);
        }

        public List<ChiTietDonHang> GetCTHoaDonByID(int ctHoaDonID)
        {
            return _iCTHoaDon.GetChiTietHDByID(ctHoaDonID);
        }

        public void InsertChiTietHoaDon(ChiTietDonHang chiTietHD)
        {
            _iCTHoaDon.InsertChiTietHoaDon(chiTietHD);
        }

        public void UpdateChiTietHoaDon(ChiTietDonHang chiTietHD)
        {
            _iCTHoaDon.UpdateChiTietHoaDon(chiTietHD);
        }
        public List<ChiTietDonHang> GetAll()
        {
            return _iCTHoaDon.GetAll();
        }
        public void DeleteChiTietHoaDon(int chiTietHDID)
        {
            throw new NotImplementedException();
        }
    }
}
