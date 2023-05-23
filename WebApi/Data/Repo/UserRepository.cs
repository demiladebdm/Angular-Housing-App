using Microsoft.EntityFrameworkCore;
using WebApi.Interfaces;
using WebApi.Models;

namespace WebApi.Data.Repo
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _dc;
        public UserRepository(DataContext dc)
        {
            this._dc = dc;

        }
        public async Task<User> Authenticate(string userName, string password)
        {
            return await _dc.Users.FirstOrDefaultAsync(x => x.Username == userName && x.Password == password);
        }
    }
}