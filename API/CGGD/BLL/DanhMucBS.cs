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
    public class DanhMucBS : IDanhMucBS
    {
        private IDanhMucRP _iDanhMuc;
        public DanhMucBS(IDanhMucRP _iDanhMucDAL)
        {
            _iDanhMuc = _iDanhMucDAL ?? throw new ArgumentNullException(nameof(_iDanhMucDAL));
        }
        public void DeleteDanhMuc(int danhMucID)
        {
            _iDanhMuc.DeleteDanhMuc(danhMucID);
        }

        public DanhMuc GetDanhMucByID(int danhMucID)
        {
            return _iDanhMuc.GetDanhMucByID(danhMucID);
        }

        public void InsertDanhMuc(DanhMuc danhMuc)
        {
            _iDanhMuc.InsertDanhMuc(danhMuc);
        }

        public void UpdateDanhMuc(DanhMuc danhMuc)
        {
            _iDanhMuc.UpdateDanhMuc(danhMuc);
        }

        public List<DanhMuc> GetAll()
        {
            return _iDanhMuc.GetAll();
        }
    }
}
