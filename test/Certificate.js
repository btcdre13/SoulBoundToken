const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("Certificate SBT", function () {
  // globals vars
  let Certificate;
  let certificate;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function() {
    // Get factory and Signers

    Certificate = await ethers.getContractFactory("Certificate");
    [owner, addr1, addr2] = await ethers.getSigners();

    certificate = await Certificate.deploy("TestCertificate", "TC");

    
  });

  describe("Deployment", function() {
    it("should set the right owner", async function() {
      expect(await certificate.owner()).to.equal(owner.address);
    })
  });

  describe("Minting revoking, validating and UriStorage", function () {
    it("should update the holders balance after creating the certificate", async function () {
      await certificate.createCertificate(addr1.address, "asdf");
      expect(await certificate.balanceOf(addr1.address)).to.equal(1);
    });

    it("should give the correct answers for ownerOf requests", async function () {
      await certificate.createCertificate(addr1.address, "asdf");
      await certificate.createCertificate(addr2.address, "ghjk");
      expect(await certificate.ownerOf(0)).to.equal(addr1.address);
      expect(await certificate.ownerOf(1)).to.equal(addr2.address);
    });

    it("should allow the owner to revoke certificates", async function() {
      await certificate.createCertificate(addr1.address, "asdf");
      expect(await certificate.isValid(0)).to.be.true;
      await certificate.revoke(0);
      expect(await certificate.isValid(0)).to.be.false;

    });

    it("should not allow others to revoke certificates", async function () {
      await certificate.createCertificate(addr1.address, "asdf");
      await expect(certificate.connect(addr2).revoke(0)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should show the correct results for valid and unvalid certificates", async function() {
      await certificate.createCertificate(addr1.address, "asdf");
      await certificate.createCertificate(addr2.address, "dfgh");
      await certificate.revoke(0);
      expect(await certificate.isValid(0)).to.be.false;
      expect(await certificate.isValid(1)).to.be.true;
    });

    it("should store the correct tokenUri for created certificates", async function() {
      await certificate.createCertificate(addr1.address, "test");
      expect(await certificate.tokenURI(0)).to.equal("test");
    });



  })
})
