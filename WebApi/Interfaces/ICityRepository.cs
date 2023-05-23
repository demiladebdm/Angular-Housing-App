using WebApi.Models;

namespace webapi.Interfaces
{
    public interface ICityRepository
    {
        Task<IEnumerable<City>> GetCitiesAsync();
        void AddCity(City city);
        void DeleteCity(int CityId);      

        Task<City> FindCity(int id);
    }
}