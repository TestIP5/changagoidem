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
    public class GioHangBS : IGioHangBS
    {
        private IGioHangRP _iGioHang;
        public GioHangBS(IGioHangRP _iGioHangDAL)
        {
            _iGioHang = _iGioHangDAL ?? throw new ArgumentNullException(nameof(_iGioHangDAL));
        }
        public void DeleteGioHang(int gioHangID)
        {
            _iGioHang.DeleteGioHang(gioHangID);
        }

        public GioHang GetGioHangByID(int gioHangID)
        {
            return _iGioHang.GetGioHangByID(gioHangID);
        }

        public void InsertGioHang(GioHang gioHang)
        {
            _iGioHang.InsertGioHang(gioHang);
        }
       
        public void UpdateGioHang(GioHang gioHang)
        {
            _iGioHang.UpdateGioHang(gioHang);
        }

        public List<GioHang> GetAll()
        {
            return _iGioHang.GetAll();
        }
    }
}
