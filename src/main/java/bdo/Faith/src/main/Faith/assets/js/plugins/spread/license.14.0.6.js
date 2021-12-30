jQuery(function() {
	var spreadLicenseProd ="sacp.bdo.com.cn|sacpdemo.bdo.com.cn,322591712413295#B02SDUOYBFUUJUZRZjMtZlTt5UYQB7RvV5Z7YEOMBlYZV6NnZGMBNjRvtSQR5GSShFTFlXaFpHe9QkTZh6YUJFV6FlWwRVNi3CdTVUM7ZXY7BFc94WRSB5R5VlbMp4SEhFbQlXSt3iS8d4bU3GZzl6dZZDZnlTYrsSQC56MHFEOwUENK54Z4Q5a5FGa5U6RvcTW6E6RFVWYkh6LwVXS4kTSpNlUrMjdvAXarVTTGNHUxEWODhjT9EGMzVkNzhlNjtSWvRWSwZkSv4EN7M4TJVGevoEd5dTaUV5LPFXdqNXbVp5TyIUVCBnNw9EdNBjeCJ6NkVVSBlnNzQjdnxUQLNDO7MGcrc6YiojITJCLiIkNCZjRFNkI0ICSiwCN6cjM6YDN6ATM0IicfJye&Qf35VfiUURJZlI0IyQiwiI4EjL6BCITpEIkFWZyB7UiojIOJyebpjIkJHUiwiI5UTNzkDMgMTMxEDMyAjMiojI4J7QiwiIuNmLt36Yu2GZi9ybtVGZwNWYzxibj9SbvNmLvRmYuA7YhNnI0IyctRkIsISKZyL9ICZ9aCY0ump9K0q99m89oAYimHqilvoukjIulHqrorJvkH0vkv8qnLiOiEmTDJCLiUTOyMTM4ITM7ETO5IjMzIiOiQWSiwSflNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPnVlQkR4L5E6YT9kdpd6KGJ7LHtWN5lTOU36NF96boVENDJ6RyZjMsVEOnhGaiVnRlhjWr5Gc7QHd6lTO9ZjQIdVbL5kSJJDWOtWNwUTCzBE";
	var spreadLicenseUat ="sacpuat.bdo.com.cn,985967435228267#B0fcKl6TwA7bh9ENndHZOZTTXFGRJdVMkFVe6p6KDx6ZoBzaDtmYYREOFh4axNzQMlkSIhnbxkGanNEbMtCc7w6LBtmUyFTb03yME5mah9EW6dlaQlTY8kjayIFWUpHeyEVWxtSOoRWe6tWQHVmVuZHVsNXYrd6b5ZDOtRXN4kUU6o7bN3UdDFENrd4L53mViZzZrQ5YERVNx3STPNUdN3iWYdjcvVlSVNkZl5kTZpGZywWYwhXWv2WO5cHWpZnSKZjcUh7UXZVO8FGOK3ESoplaQNFTlZXZDFXW6dWZLR5KzcDUCFlNXNnVsZDZhFlVvclQygmRVlDZtlHS7Z7QiojITJCLiYEMDRjMwEjMiojIIJCL4IDMwAzNxkTM0IicfJye#4Xfd5nIFVUSWJiOiMkIsICNx8idgAyUKBCZhVmcwNlI0IiTis7W0ICZyBlIsIiM4ADN9ADIzETMxAjMwIjI0ICdyNkIsIibj9SbvNmLvRmYuQXY5B7YhNnI0IyctRkIsISKZyL9ICZ9aCY0ump9K0q99m89oAYimHqilvoukjIulHqrorJvkH0vkv8qnLiOiEmTDJCLicjNygjMyUzM4cjN9UDO9IiOiQWSiwSflNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPBhEavQHR4QHSshmNkRmZqljNXdVN8xERLlVcqpHOSNzKolXZjZ5S7k4cUd5RFxES7NXTQJEMsZlQIFkVBlXZRx4L9YDTqpma4cUMz2EOzw4YvlUbuV7T6p";
	var designerLicenseProd = "sacpuat.bdo.com.cn|sacpdemo.bdo.com.cn|sacp.bdo.com.cn,954139928538995#B0PRtHWaJVOnFWUFpUUVNDThtERlplTTNzN4g7avNHRY3kUtpWdEd4LVpFMlxETGlXb6o5NwFDWmVHbvd5dKNmWxUmMRZ7akJVS7BDbiRDZJRjbvpGcVJDTah5Z9JTVKZFMYZ4Rp3WNMpHaz5WWUF7VoFGSVhWblhnURN6YvF7dz3SYRR6ZoBDMFRlT6cENyQ4SMpVUiNkM7Ulb6Jje0hDOSFmdp3WZotmMxo7U9ZDTyhnatNmdyElYitCO6dDZvJEeVxmN6E6ZalTOD3mUppVbQhjQKBXNvolT7Ezd7VTd7NXQqBlZoVGW4dWZxhGVrdGcpJ7cph7ZK5EVU96NVZHcT9GWaVDMBt6UiojITJCLiIjMwI4NGhzMiojIIJCL8MTOzUTMyADO0IicfJye&Qf35VfiklNFdjI0IyQiwiI4EjL6Bicl96ZpNXZE5yUKRWYlJHcTJiOi8kI1tlOiQmcQJCLiEjMyQTOwAyMxETMwIDMyIiOiQncDJCLi86Yu46bj9ybkJmLwNWYzxibj9SbvNmLvRmYu2WblRGcjF6cs86Yu46bj9ybkJmL4FWdwNWYzJiOiMXbEJCLikSm2SOiQWumAmurZauiuaeuJeOKAmo9hqY9LqL9Iib9h0K0ayL9h+L9Lu09iojIh94QiwiI5kTO8MTN8ITO9MTM4UTOiojIklkI1pjIEJCLi4TPn3mYXNzZahENoZXU54mZycVeKhWdlZ4L9g6U45WYLlnRyJVcahUY5QHVXVnMuFUTatWVjhja8Vkdi34Y8FkNiVlR7YHdFZmNKxUCxoD";
	var designerLicenseLocal = "Designer-372234933327658#B031laHZlVzond0hHZvcDRvk6Y4Z5ZV3yc9cjavAjUMFFa7hFVxUWZIRHTYd4R7MGM7gHZzgFUalzT5BHevV5UC3CTjZDVaJmdTN6YXdFRphHUMFDNN9WU9k6dKNGUtN5bqBDOzJEWnFUW7JWY6lGZGBlczNkV8IzcjRkYFtERvtCTyVlZrQTeC5mVHZXMC3GZLxGaxMEcRREeDpmYYlHUHJDR7ImR59ENJ9WU4E7VC3yZnNDTBZ5SQhzS8cjR7MjYIB5LUZnSa34LDlGOEtCWKZDNwd5VvNzdChmR6YzNwUUZptycyI5T9UWZrRnT4BTU7pXZTZXMRNWRYBzSiojITJCLiY4MwIEOwQzNiojIIJCL7MTO5AzM5ITM0IicfJye#4Xfd5nIFVUSWJiOiMkIsICNx8idgAyUKBCZhVmcwNlI0IiTis7W0ICZyBlIsICMzMzM9ADIzETMxAjMwIjI0ICdyNkIsICMuAjLw8CMvIXZudWazVGZiojIz5GRiwiIpkJvkjIklrJgp1ammrormnbinjCgJaeoKW+i0SOi8Weouium2Seo/S+ireuI0ISYONkIsICO5YzNyMzMzkDNzIjM7MjI0ICZJJCL3VWdyRnOiI7ckJye0ICbuFkI1pjIEJCLi4TPBBFcVZke5ATdygTT8pERxUTRTtianhTQzAzNZN7b7F6blxWYP9kZwJ7Ssx6LXhTWztWONZ5cndlSwEjU746Z52kcyF5Kop6TXxWewcHZwgVOnVkZ8YEavlwb";
	var spreadLicenseArr = {
		'sacpuat.bdo.com.cn': spreadLicenseUat,
		'sacp.bdo.com.cn': spreadLicenseProd,
		'sacpdemo.bdo.com.cn': spreadLicenseProd
	}
	var designerLicenseArr = {
		'sacpuat.bdo.com.cn': designerLicenseProd,
		'sacp.bdo.com.cn': designerLicenseProd,
		'sacpdemo.bdo.com.cn': designerLicenseProd
	}
	var currentDomain = document.domain;
	if(spreadLicenseArr[currentDomain]) {
		GC.Spread.Sheets.LicenseKey = spreadLicenseArr[currentDomain];
	}else {
		GC.Spread.Sheets.LicenseKey = spreadLicenseUat;
	}
	if(designerLicenseArr[currentDomain]) {
		GC.Spread.Sheets.Designer.LicenseKey = designerLicenseArr[currentDomain];
	}else {
		GC.Spread.Sheets.Designer.LicenseKey = designerLicenseProd;
	}
});