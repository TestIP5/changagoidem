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
    public class BinhLuanBS : IBinhLuanBS
    {
        private readonly IBinhLuanRP _iCommentDAL;
        public BinhLuanBS(IBinhLuanRP iComment)
        {
            _iCommentDAL = iComment ?? throw new Exception(nameof(iComment));
        }
        public void DeleteComment(int commentID)
        {
            _iCommentDAL.DeleteComment(commentID);
        }

        public List<BinhLuan> GetCommentByID(int commentID)
        {
            return _iCommentDAL.GetCommentByID(commentID);
        }

        public void InsertComment(BinhLuan comment)
        {
            _iCommentDAL.InsertComment(comment);
        }

        public void UpdateComment(BinhLuan comment)
        {
            _iCommentDAL.UpdateComment(comment);
        }

        public List<BinhLuan> GetAll()
        {
            return _iCommentDAL.GetAll();
        }
    }
}
