function CustomerModel() {
	this.CustomerID = ko.observable();
	this.CreatedDate = ko.observable();	
	this.FirstName = ko.observable();
	this.LastName = ko.observable();
	this.Address1 = ko.observable();
	this.Address2 = ko.observable();
	this.City = ko.observable();
	this.State = ko.observable();
	this.Zip = ko.observable();
}

function AccountsModel() {
	this.AccountID = ko.observable();
	this.CustomerID = ko.observable();
	this.CreatedDate = ko.observable();
	this.AccountNumber = ko.observable();
	this.Balance = ko.observable();
}

function TransactionsModel() {
	this.TransactionID = ko.observable();
	this.AccountID = ko.observable();
	this.TransactionDate = ko.observable();
	this.Amount = ko.observable();
}

function ViewModel() {
	var self = this;
	
	// page management
self.page = ko.observable('customer.grid');
	
	// customer.detail
	self.selectedCustomer = new CustomerModel();
	self.selectedCustomerAccounts = ko.observableArray();
	self.saveCustomer = function() {
		if(self.page() == 'customer.add') {
			$.ajax({
				type: 'POST',
				url: 'http://localhost:61144/api/customers',
				contentType: 'application/json;charset=utf-8',
				data: ko.mapping.toJSON(self.selectedCustomer),
				success: function(data) {
					alert('added');
					
					self.page('customer.grid');
				}
			});
		} else {
			$.ajax({
				type: 'PUT',
				url: 'http://localhost:61144/api/customers/s?id=' + self.selectedCustomer.CustomerID(),
				contentType: 'application/json;charset=utf-8',
				data: ko.mapping.toJSON(self.selectedCustomer),
				success: function(data) {
					alert('save successful');
					
					self.page('customer.grid');
				}
			});	
		}
	};
	
	// customer.grid
	self.customers = ko.observableArray();
	self.addCustomer = function() {
		self.page('customer.add');	
	};
	self.editCustomer = function(customer) {
		$.ajax({
			type: 'GET',
			url: 'http://localhost:61144/api/customers/' + customer.CustomerID(),
			success: function(data) {
				ko.mapping.fromJS(data, {}, self.selectedCustomer);
				
				$.ajax({
					type: 'GET',
					url: 'http://localhost:61144/api/customers/' + customer.CustomerID() + '/accounts',
					success: function(data) {
						ko.mapping.fromJS(data, {}, self.selectedCustomerAccounts);
						
						self.page('customer.detail');
					}
				});
			}
		});
	};
	self.deleteCustomer = function(customer) {
		if(confirm("Are you sure you wish to delete this customer?")) {
			$.ajax({
				type: 'DELETE',
				url: 'http://localhost:61144/api/customers/?id=' + customer.CustomerID(),
				success: function(data) {
					alert('deleted');
				}
			})
		}	
	};
	
	self.getAccountsForCustomer = function() {
		$.ajax({
			type: 'GET',
			url: 'http://localhost:61144/api/customers/' + customer.CustomerID() + '/accounts',
			success: function(data) {
				ko.mapping.fromJS(data, {}, self.selectedCustomerAccounts);
				
				self.page('customer.detail');
			}
		});
	}
	
	$.ajax({
		type: 'GET',
		url: 'http://localhost:61144/api/customers',
		success: function(data) {
			ko.mapping.fromJS(data, {}, self.customers);
		}
	});
	self.cancel = function() {
		self.page('customer.grid')	
	};

}

ko.applyBindings(new ViewModel());