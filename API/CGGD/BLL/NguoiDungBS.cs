using BLL.interfaces;
using DAL.Interfaces;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class NguoiDungBS : INguoiDungBS
    {
        private INguoiDungRP _iNguoiDung;
        public NguoiDungBS(INguoiDungRP _iNguoiDungDAL)
        {
            _iNguoiDung = _iNguoiDungDAL ?? throw new ArgumentNullException(nameof(_iNguoiDungDAL));
        }
        public void DeleteNguoiDung(string nguoiDungID)
        {
            _iNguoiDung.DeleteNguoiDung(nguoiDungID);
        }

        public NguoiDung GetUserByID(string UserID)
        {
            return _iNguoiDung.GetUserByID(UserID);
        }

        public void InsertNguoiDung(NguoiDungDoi nguoiDung)
        {
            _iNguoiDung.InsertNguoiDung(nguoiDung);
        }

        public void UpdateNguoiDung(NguoiDungDoi nguoiDung)
        {
            _iNguoiDung.UpdateNguoiDung(nguoiDung);
        }

        public List<NguoiDung> GetAll()
        {
            return _iNguoiDung.GetAll();
        }
    }
}
